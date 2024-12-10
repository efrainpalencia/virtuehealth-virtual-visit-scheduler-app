# Use a slim Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirement files
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files into the container
COPY . .

# Set environment variables for Django
ENV DJANGO_SUPERUSER_EMAIL=admin@example.com
ENV DJANGO_SUPERUSER_PASSWORD=admin123

# Run migrations and create a superuser during container startup
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && \
    if [ -n \"$DJANGO_SUPERUSER_EMAIL\" ] && [ -n \"$DJANGO_SUPERUSER_PASSWORD\" ]; then \
    python manage.py createsuperuser --noinput; \
    fi && \
    gunicorn VirtueHealthCore.wsgi:application --bind 0.0.0.0:8000"]
