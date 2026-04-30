import { db } from './sqlite';

export function seedUser() {
    db.runSync(
        `
        INSERT OR IGNORE INTO users (email, password, created_at)
        VALUES (?, ?, ?);`,
        ['itallo@pokedex.com', '123456', new Date().toISOString()]
        
    )
}