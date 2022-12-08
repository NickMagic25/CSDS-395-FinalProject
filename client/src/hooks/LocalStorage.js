import { useEffect, useState} from 'react'

const localStoragePrefix = 'chat-app-'

export default function LocalStorage(key, starting_Value) {
    
    const uniquePrefixKey = localStoragePrefix + key
    console.log(uniquePrefixKey)
    const [value, setValue] = useState(() => {

        const jsonValue = localStorage.getItem(uniquePrefixKey)
        if (jsonValue !== null && jsonValue !== 'undefined') return JSON.parse(jsonValue)

        if (typeof initialValue === 'function') {
          return starting_Value()
        } else {
          return starting_Value
        }
       
     /*   const jsonValue = localStorage.getItem(uniquePrefixKey) || {};
        //=== 'undefined' ? "{}" : localStorage.getItem(uniquePrefixKey) ;
         if (jsonValue != null && jsonValue !== 'undefined') return JSON.parse(jsonValue)
         console.log(jsonValue)

         if (key == 'messages' || key == 'contacts') {
            console.log('entering into message')
            return {};
        }
       
        if(typeof starting_Value === 'function') {
            return starting_Value()
        } else {
            return starting_Value
        }  */
    })

    useEffect(() => {
        localStorage.setItem(uniquePrefixKey, JSON.stringify(value))
    }, [uniquePrefixKey, value])

    return [value, setValue]

}