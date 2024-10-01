# Use the official Python image as a base
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements_index.txt .

# Install the dependencies
RUN pip install --upgrade pip && pip install -r requirements_index.txt

# Copy the rest of the application code into the container
COPY . .

# Copy the wait-for-it script into the container and set permissions
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expose the port that the Flask app runs on
EXPOSE 5000

# Run the application using the wait-for-it script
CMD ["/wait-for-it.sh", "elasticsearch:9200", "--timeout=120", "--", "python", "index_data.py"]
