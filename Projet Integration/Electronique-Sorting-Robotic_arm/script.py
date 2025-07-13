import pigpio
import time
import numpy as np
import threading
import asyncio
from component_recognition import capture_and_detect


# Initialisation of pigpio
pi = pigpio.pi()
if not pi.connected:
    print("Failed to connect to pigpio daemon")
    exit()

# Servo pins configuration
servo_pins = [23, 24, 25, 12, 20, 21]
default_angles = [90, 100, 63, 72, 162, 70]  # Default angles in degrees
sleep = 1

# Constants for servo control
MIN_PWM = 500    # 0° for MG996R
MAX_PWM = 2500   # 180° for MG996R
SERVO_SAFE_LIMITS = [
    (0, 180),    # Base rotation (joint1)
    (45, 135),   # Shoulder (joint2)
    (0, 180),    # Elbow (joint3)
    (45, 135),   # Wrist pitch (joint4)
    (0, 180),    # Wrist roll (joint5)
]


def angle_to_pwm(angle):
    """Convert angle (0-180 degrees) to PWM value (500-2500)"""
    angle = np.clip(angle, 0, 180)
    pwm_value = int(MIN_PWM + (angle / 180.0) * (MAX_PWM - MIN_PWM))
    return pwm_value

def set_servo(index, angle, duration=0):
    """Set a single servo to a specific angle with optional duration"""
    pwm = angle_to_pwm(angle)
    pi.set_servo_pulsewidth(servo_pins[index], pwm)
    if duration > 0:
        time.sleep(duration)

def set_servos(angles, duration=0):
    """Set all servos to specified angles with optional duration"""
    for i, angle in enumerate(angles):
        set_servo(i, angle)
    if duration > 0:
        time.sleep(duration)

def stop():
    """Safely stop all servos"""
    set_servos(default_angles)
    time.sleep(1)
    for pin in servo_pins:
        pi.set_servo_pulsewidth(pin, 0)
    print("Servos stopped (PWM disabled).")

def initialize():
    """Initialize the robot arm"""
    print("Initializing robot arm...")
    set_servos(default_angles)
    time.sleep(1)
    print("Robot arm initialized.")


def drop():
    set_servo(5, 50)
    time.sleep(sleep)

def take():
    set_servo(5, 106)
    time.sleep(sleep)

def up():
    set_servo(2, 110)
    time.sleep(sleep)

def down():
    set_servo(2, 90)
    time.sleep(sleep)

def to_component():
    angles = [55, 95, 70, 80, 125]
    #angles = [55, 90, 80, 90]
    up()
    set_servo(0, 55)
    time.sleep(sleep)
    set_servos(angles)
    time.sleep(sleep)
    take()
    
    
def to_resistance():
    angles = [138, 100, 68, 75]
    #angles = [138, 100, 68, 75]
    up()
    set_servo(0, 138)
    time.sleep(sleep)
    set_servos(angles)
    time.sleep(sleep)
    take()
    
    

def to_led():
    angles = [90, 78, 90, 50]
    #angles = [90, 78, 90, 50]
    up()
    set_servo(0, 90)
    time.sleep(sleep)
    set_servos(angles)
    time.sleep(sleep)
    take()

def to_transistor():
    angles=[115, 78, 90, 50]
    #angles=[115, 78, 90, 50]
    up()
    set_servo(0, 115)
    time.sleep(sleep)
    set_servos(angles)
    time.sleep(sleep)
    take()

def to_capacitor():
    angles=[65, 78, 90, 50]
    #angles=[65, 78, 90, 50]
    up()
    set_servo(0, 65)
    time.sleep(sleep)
    set_servos(angles)
    time.sleep(sleep)
    take()
    
def default_pos():
    set_servos(default_angles)
    time.sleep(sleep)

def script(stop_event, label):
    print("SCRIPT STARTED")
    default_pos()
    
    if stop_event.is_set():
        return
    
    try:
        if label == 'Resistor':
            if stop_event.is_set(): return
            to_component()
            if stop_event.is_set(): return
            to_resistance()
            if stop_event.is_set(): return
            drop()
            if stop_event.is_set(): return
            up()
        
        elif label == 'Led':
            if stop_event.is_set(): return
            to_component()
            if stop_event.is_set(): return
            to_led()
            if stop_event.is_set(): return
            drop()
            if stop_event.is_set(): return
            up()
        
        elif label == 'Transistor':
            if stop_event.is_set(): return
            to_component()
            if stop_event.is_set(): return
            to_transistor()
            if stop_event.is_set(): return
            drop()
            if stop_event.is_set(): return
            up()
        
        elif label == 'Capacitor':
            if stop_event.is_set(): return
            to_component()
            if stop_event.is_set(): return
            to_capacitor()
            if stop_event.is_set(): return
            drop()
            if stop_event.is_set(): return
            up()
    
    except Exception as e:
        print(f"Erreur durant le script de tri : {e}")
    
    finally:
        if stop_event.is_set():
            default_pos()

async def send_to_websocket(websocket, item_label):
    # Envoi des données via WebSocket
    await websocket.send_text(item_label)

def detect_item():
    """Default item detection method"""
    from component_recognition import capture_and_detect
    return capture_and_detect()

def start_sorting(detect_item_func=None, websocket_callback=None, stop_event=None):
    """
    Fonction de tri principale intégrant la logique
    avec support WebSocket pour les mises à jour
    """
    # Use default detection if no function provided
    if detect_item_func is None:
        detect_item_func = detect_item

    # Create stop_event if not provided
    if stop_event is None:
        stop_event = threading.Event()

    # Initialisation
    initialize()

    # Sorting Loop
    try:
        for _ in range(1000):
            # Stop if requested
            if stop_event.is_set():
                break

            # Detect element
            item_label = detect_item_func()

            # if no element detected, stop
            if item_label is None:
                stop()
                break

            if websocket_callback:
                try:
                    websocket_callback(item_label)
                except Exception as e:
                    print(f"Error sending WebSocket message: {e}")
                    break

            #execute script for the element
            script(stop_event, item_label)

            time.sleep(0.5)

    except Exception as e:
        print(f"Erreur durant le processus de tri : {e}")
    
    finally:
        # Toujours revenir à la position par défaut
        default_pos()
        # Ensure stop event is set
        if stop_event:
            stop_event.set()

    print("Sorting process completed.")
    return "Sorting finished"
