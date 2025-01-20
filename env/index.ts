import {cleanEnv, url} from 'envalid'

export const env = cleanEnv(process.env, {
    UI_URL: url(),
})
