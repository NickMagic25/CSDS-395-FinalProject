import { useEffect, useState} from 'react'

const localStoragePrefix = 'messaging_app-'

export default function LocalStorage(key, starting_Value) {
    const uniquePrefixKey = localStoragePrefix + key
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(uniquePrefixKey)
        if (jsonValue != null)
            return JSON.parse(jsonValue)
        if(typeof starting_Value === 'function') {
            return starting_Value()
        } else {
            return starting_Value
        }
    })

    useEffect(() => {
        localStorage.setItem(uniquePrefixKey, JSON.stringify(value))
    }, [uniquePrefixKey, value])

    return [value, setValue]
}