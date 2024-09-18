# Use the official Python image as a base
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements /app/requirements
RUN pip install --upgrade pip && pip install -r requirements

# Copy the rest of the application code
COPY . /app

# Expose the port that the Flask app runs on
EXPOSE 5000

# Run the index_data.py script and then start the Flask app
CMD ["sh", "-c", "python3 search/backend/index_data.py && python3 submitter.py"]
