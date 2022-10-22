import { useEffect, useState } from 'react'

export const useForm = (initialState, callBack) => {
  const [fields, setFields] = useState(initialState)

  useEffect(() => {
    if (callBack) callBack(fields)
  }, [fields])

  const handleChange = ({ target }) => {
    const { labels } = fields

    const field = target.name
    let value = target.name === 'labels' ? labels || [] : ''

    switch (target.name) {
      case 'name':
        value = target.value
        break;
      case 'price':
        value = +target.value
        break;
      case 'inStock':
        value = target.value === 'true' ? true : false
        break;
      case 'labels':
        if (value.includes(target.value)) return
        value.push(target.value)
        break;
    }

    setFields((prevFields) => ({ ...prevFields, [field]: value }))
  }

  return [fields, handleChange, setFields]
}