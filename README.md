# Expense Reimbursement System - Testovi

## Opis projekta
Projekt sadrži testove za sustav upravljanja refundacijama troškova.
Testovi pokrivaju tri razine testiranja: unit, API i E2E.

## Struktura testova
## Preduvjeti
- Node.js (>=14.0.0)
- npm

## Instalacija
```bash
# U root direktoriju projekta
npm install

# U backend folderu
cd backend && npm install

# U frontend folderu
cd frontend && npm install
```

## Pokretanje aplikacije
Prije pokretanja testova potrebno je pokrenuti backend i frontend u odvojenim terminalima.

```bash
# Terminal 1 - Backend (port 3001)
cd backend
node index.js

# Terminal 2 - Frontend (port 3000)
cd frontend
npm start
```

## Pokretanje testova

### Unit i API testovi (Jest + SuperTest)
```bash
npm test
```

### E2E testovi (Cypress)
```bash
# Aplikacija mora biti pokrenuta!
npx cypress run
```

## Korisnici za testiranje
| Uloga | Username | Password |
|-------|----------|----------|
| Admin | admin | adminPass |
| Korisnik | Iva | Iva123 |
| Korisnik | Marta | Marta123 |