import pigpio
import time
import numpy as np
from T_image import detect_item

# Initialisation of pigpio
pi = pigpio.pi()
if not pi.connected:
    print("Failed to connect to pigpio daemon")
    exit()

# Servo pins configuration
servo_pins = [23, 24, 25, 12, 20, 21]
default_angles = [90, 100, 63, 72, 162, 70]  # Default angles in degrees

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
    set_servo(5, 70)
    time.sleep(0.5)

def take():
    set_servo(5, 105)
    time.sleep(0.5)

def up():
    set_servo(2, 110)
    time.sleep(0.5)

def down():
    set_servo(2, 80)
    time.sleep(0.5)

def to_component():
    angles = [55, 90, 80, 90]
    set_servos(angles)
    time.sleep(0.5)
    
def to_resistance():
    angles = [138, 100, 68, 75]
    set_servos(angles)
    time.sleep(0.5)

def to_led():
    angles = [90, 78, 90, 50]
    set_servos(angles)
    time.sleep(0.5)

def to_transistor():
    angles=[115, 78, 90, 50]
    set_servos(angles)
    time.sleep(0.5)

def to_undetermined():
    angles=[65, 78, 90, 50]
    set_servos(angles)
    time.sleep(0.5)
    
def default_pos():
    set_servos(default_angles)
    time.sleep(0.5)

def script(label):
    default_pos()
    if label == 'Resistor':
        up()
        to_component()
        down()
        take()
        up()
        to_resistance()
        down()
        drop()
        up()
    elif label == 'Led':
        up()
        to_component()
        down()
        take()
        up()
        to_led()
        down()
        drop()
        up()
    elif label == 'Transistor':
        up()
        to_component()
        down()
        take()
        up()
        to_transistor()
        down()
        drop()
        up()
    elif label == 'Undetermined':
        up()
        to_component()
        down()
        take()
        up()
        to_undetermined()
        down()
        drop()
        up()

def start_sorting():
    initialize()
    for _ in range(1000):
        item_label = detect_item()
        if item_label is None:
            stop()
            return 
        else:
            script(item_label)

    
def take_canard_sequence():
    up()
    drop()
    to_component()
    down()
    take()
    up()
    to_resistance()
    down()
    drop()
    up()
    default_pos()

def main():
    print("Robot Arm Control System")
    print("Commands:")
    print("  start          - Initialize the robot arm")
    print("  servo n,angle  - Move specific servo")
    print(" component, resistance, led, transistor, undetermined  -  Move to the specified area")
    print("  stop          - Stop all servos")
    print("  exit          - Exit program")

    initialize()

    while True:
        try:
            user_input = input("> ").strip().lower()
            
            if user_input == "start":
                initialize()
                    
            elif user_input.startswith("servo "):
                try:
                    params = user_input[6:].split(',')
                    if len(params) == 2:
                        index = int(params[0]) - 1
                        angle = float(params[1])
                        if 0 <= index < len(servo_pins):
                            set_servo(index, angle)
                            print(f"Servo {index + 1} set to {angle} degrees")
                        else:
                            print(f"Invalid servo index. Use 1-{len(servo_pins)}")
                    else:
                        print("Invalid servo command. Use: servo n,angle")
                except ValueError as e:
                    print(f"Invalid input: {e}")

            elif user_input == "component":
                to_component()

            elif user_input == "resistance":
                to_resistance()

            elif user_input == "undetermined":
                to_undetermined()
            
            elif user_input == "led":
                to_led()
            
            elif user_input == "transistor":
                to_transistor()

            elif user_input == "grab":
                set_servo(5, 105)

            elif user_input == "drop":
                set_servo(5, 70)
            
            elif user_input == "secret angle":
                angles = [90, 75, 130, 10, 162]
                set_servos(angles)
                    
            elif user_input == "canard":
                take_canard_sequence()

            elif user_input == "stop":
                stop()
                
            elif user_input == "exit":
                stop()
                break
                
            else:
                print("Unknown command")
                
        except KeyboardInterrupt:
            print("\nInterrupted by user")
            stop()
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    try:
        main()
    finally:
        pi.stop()
