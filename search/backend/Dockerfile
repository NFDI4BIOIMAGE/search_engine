# Use the official Python 3.12 image (as of my knowledge cutoff in September 2021, Python 3.12 may not be available. You can use 'python:3.10' or the latest available version)
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt into the container
COPY requirements.txt ./

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose port 5000 to allow external access
EXPOSE 5000

# Set environment variables (optional)
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Command to run the application using Gunicorn, better performance and security
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
