FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /usr/src/app

# Install OS dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    libpq-dev \
    gcc && \
    pip install --upgrade pip

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entrypoint script ONLY
COPY entrypoint.sh .

# No COPY . .   👈 IMPORTANT  
# Because the volume mount will bring your code!
# COPY . . would be overwritten by the mount → wasted layer.

EXPOSE 8000

CMD ["/usr/src/app/entrypoint.sh"]
