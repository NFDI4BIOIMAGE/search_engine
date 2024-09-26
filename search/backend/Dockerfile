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

# Run the application
CMD ["python", "index_data.py"]
