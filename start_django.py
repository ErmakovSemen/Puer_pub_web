#!/usr/bin/env python
import os
import sys
import subprocess

def main():
    os.chdir('backend')
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tea_game.settings')
    
    # Start Django server
    print("Starting Django server on port 8000...")
    subprocess.run([
        sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
    ])

if __name__ == '__main__':
    main()