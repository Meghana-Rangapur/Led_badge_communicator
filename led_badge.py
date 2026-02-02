import pygame
import tkinter as tk
from tkinter import simpledialog
import pyttsx3
import speech_recognition as sr
from googletrans import Translator
import cv2
import mediapipe as mp

pygame.init()

WIDTH, HEIGHT = 400, 100
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("LED Badge Communicator")

BLACK = (0, 0, 0)
RED = (255, 0, 0)

font = pygame.font.Font(None, 50)

# Initialize text-to-speech engine
engine = pyttsx3.init()
translator = Translator()
recognizer = sr.Recognizer()
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

# Predefined gestures for messages
gesture_messages = {
    "one_finger": "Hello!",
    "two_fingers": "I need help!",
    "thumbs_up": "Thank you!"
}

def speak_text(text):
    engine.say(text)
    engine.runAndWait()

def get_text():
    root = tk.Tk()
    root.withdraw()
    user_input = simpledialog.askstring("Input", "Enter your message:")
    return user_input

def voice_to_text():
    with sr.Microphone() as source:
        print("Speak Now...")
        audio = recognizer.listen(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Could not understand"

def translate_text(text, dest_lang='es'):
    return translator.translate(text, dest=dest_lang).text

def detect_gesture():
    cap = cv2.VideoCapture(0)
    message = ""
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb_frame)
        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                landmarks = hand_landmarks.landmark
                if landmarks[8].y < landmarks[6].y:
                    message = gesture_messages.get("one_finger", "Hello!")
                elif landmarks[12].y < landmarks[10].y:
                    message = gesture_messages.get("two_fingers", "I need help!")
                elif landmarks[4].x > landmarks[3].x:
                    message = gesture_messages.get("thumbs_up", "Thank you!")
        cv2.imshow("Gesture Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    return message

def led_badge_display():
    input_method = simpledialog.askstring("Input Method", "Choose input method: text, voice, or gesture")
    if input_method == "voice":
        message = voice_to_text()
    elif input_method == "gesture":
        message = detect_gesture()
    else:
        message = get_text() or "Hello!"
    
    translated_message = translate_text(message, 'es')
    speak_text(translated_message)
    text_surface = font.render(translated_message, True, RED)

    clock = pygame.time.Clock()
    x_pos = WIDTH
    running = True
    while running:
        screen.fill(BLACK)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        screen.blit(text_surface, (x_pos, HEIGHT // 8))
        x_pos -= 2

        if x_pos < -text_surface.get_width():
            x_pos = WIDTH

        pygame.display.update()
        clock.tick(30)

    pygame.quit()

if __name__ == "__main__":
    led_badge_display()
