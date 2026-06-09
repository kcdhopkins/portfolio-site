import { MongoClient } from "mongodb"

const uriTemplate = process.env.MONGODB_URI_TEMPLATE
function buildUri(password?: string) {
    if (!password) throw new Error("MONGODB_PASSWORD not set in environment")
    return uriTemplate.replace("<db_password>", encodeURIComponent(password))
}

let cachedClient: MongoClient | null = null

export async function getDb(dbName = "ai-message-history") {
    if (cachedClient) {
        return cachedClient.db(dbName)
    }

    const password = process.env.MONGODB_PASSWORD
    const uri = buildUri(password)
    const client = new MongoClient(uri)
    await client.connect()
    cachedClient = client
    return client.db(dbName)
}

export async function closeDb() {
    if (!cachedClient) return
    try {
        await cachedClient.close()
    } catch (e) {
        // ignore close errors
    } finally {
        cachedClient = null
    }
}
