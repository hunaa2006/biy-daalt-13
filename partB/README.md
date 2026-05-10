# Part B: Task Tracker - Хэрэгжүүлэлт

Энэхүү хэсэгт "Personal Task Tracker" системийн Backend болон Frontend хөгжүүлэлтийг гүйцэтгэсэн. Төслийн гол зорилго нь хэрэглэгч өөрийн ажлыг хянах, эрэмбэлэх, удирдах боломжтой хөнгөн системийг бий болгоход оршино.

## Технологийн сонголт (Stack)

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (API хөгжүүлэлт)
- **Database:** SQLite3 (`better-sqlite3` - Хурдан, файл дээр суурилсан)
- **UI:** Vanilla JavaScript, CSS3 (Modern Flexbox), HTML5
- **Testing:** Jest & Supertest (API болон логикийн тест)

## Төслийн бүтэц ба үүрэг

- `src/app.js`: Програмын оролтын цэг (Middlewares, Route холболтууд).
- `src/routes/tasks.js`: HTTP хүсэлтүүдийг (GET, POST, PATCH, DELETE) хүлээн авах замууд.
- `src/services/taskService.js`: Өгөгдлийн сантай харилцах, бизнес логик ажиллах үндсэн давхарга.
- `src/database.js`: SQLite сангийн холболт болон хүснэгт (Schema) үүсгэх хэсэг.
- `public/`: Вэб хуудасны эх код (Single Page Application бүтэцтэй).
- `tests/`: Програмын найдвартай ажиллагааг шалгах unit тестүүд.

## Суулгах болон ажиллуулах

1. **Сангуудыг суулгах:**
   ```bash
   npm install