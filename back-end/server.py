from flask import Flask, request, jsonify
from flask_cors import CORS  
import socket
import json

app = Flask(__name__)
CORS(app) 

weights = {
    "chemistry": 0.3,
    "physics": 0.3,
    "maths": 0.4
}

min_scores = {
    "chemistry": 35,
    "physics": 35,
    "maths": 35
}

overall_cutoff = 50

def calculate_cutoff(scores):
    chemistry, physics, maths = scores["chemistry"], scores["physics"], scores["maths"]
    cutoff_mark = (chemistry * weights["chemistry"] +
                   physics * weights["physics"] +
                   maths * weights["maths"])
    
    if chemistry < min_scores["chemistry"] or physics < min_scores["physics"] or maths < min_scores["maths"]:
        return {"result": "Fail - Minimum subject requirement not met", "cutoff_mark": cutoff_mark}
    
    result = "Pass" if cutoff_mark >= overall_cutoff else "Fail"
    return {"result": result, "cutoff_mark": cutoff_mark}

@app.route("/calculate_cutoff", methods=["POST"])
def handle_cutoff():
    data = request.json
    protocol = data.get("protocol").upper()  
    scores = {
        "chemistry": data["chemistry"],
        "physics": data["physics"],
        "maths": data["maths"]
    }

    if protocol == "TCP":


        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect(("localhost", 5001))
            client_socket.send(json.dumps(scores).encode())
            response_data = client_socket.recv(1024).decode()
            result_data = json.loads(response_data)
    elif protocol == "UDP":


        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client_socket:
            client_socket.sendto(json.dumps(scores).encode(), ("localhost", 5002))
            response_data, _ = client_socket.recvfrom(1024)
            result_data = json.loads(response_data.decode())
    else:
        return jsonify({"result": "Invalid protocol", "cutoff_mark": None})

    return jsonify(result_data)

def tcp_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind(("localhost", 5001))
        server_socket.listen()
        print("TCP server listening on port 5001")
        while True:
            client_socket, _ = server_socket.accept()
            with client_socket:
                data = client_socket.recv(1024)
                scores = json.loads(data.decode())
                result = calculate_cutoff(scores)
                client_socket.send(json.dumps(result).encode())

def udp_server():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as server_socket:
        server_socket.bind(("localhost", 5002))
        print("UDP server listening on port 5002")
        while True:
            data, addr = server_socket.recvfrom(1024)
            scores = json.loads(data.decode())
            result = calculate_cutoff(scores)
            server_socket.sendto(json.dumps(result).encode(), addr)

if __name__ == "__main__":
    from threading import Thread
    
    Thread(target=tcp_server, daemon=True).start()
    Thread(target=udp_server, daemon=True).start()
    
    app.run(port=5000)
