import { LocalizationContext } from '@/components/context/LocalizationContext'
import { useContext } from 'react'

type ReturnProps = {
  t: (id: string) => string
}

export const useLocalization = (): ReturnProps => {
  const { data } = useContext(LocalizationContext)

  const t = (id: string): string => {
    const value = data.data[id] ?? ''

    if (value === undefined) {
      console.error("\"" + id + "\" was not found");
      return ''
    }

    return value
  }

  return { t }
}
