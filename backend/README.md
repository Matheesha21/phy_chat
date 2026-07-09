USE FOLLOWING STEPS TO RUN DEVELOPMENT SERVER

1. create a virtual environment
    python3 -m venv venv

2. activate the virtual environment
    source venv/bin/activate

3. install required libraries
    pip install -r requirements.txt

4. run development server:
    uvicorn app:app --reload
