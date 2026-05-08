# Системийн Архитектур

Энэхүү төсөл нь Client-Server загвар дээр суурилсан бөгөөд өгөгдлийг SQLite файл дээр хадгална. Frontend болон Backend нь тусдаа давхаргад хуваагдан, HTTP протоколоор харилцана.

## 1. Бүтцийн диаграмм (Mermaid)

```mermaid
graph TD
    User((Хэрэглэгч)) --> Frontend[Frontend: HTML/JS]
    Frontend --> API[REST API Endpoints]

    subgraph Backend_Server [Node.js + Express]
        API --> Logic[Task Service / Controller]
        Logic --> DB_Driver[Better-SQLite3]
    end

    DB_Driver --> Database[(Database: tasks.db)]