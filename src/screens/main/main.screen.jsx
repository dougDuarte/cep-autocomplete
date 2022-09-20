import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks'
import './main.css'

export const MainScreen = () => {
  const [cepInfo, setCepInfo] = useState({})
  const [isCepLoading, setIsCepLoading] = useState(false)
  const [inputValue, setInputValue] = useState({ cep: '', street: '', district: '', city: '', state: '' })

  const fetch = useFetch()

  useEffect(() => {
    cepInfo && setInputValue(previous => ({
      ...previous,
      street: cepInfo.logradouro || '',
      district: cepInfo.bairro || '',
      city: cepInfo.localidade || '',
      state: cepInfo.uf || ''
    }))
  }, [cepInfo])

  useEffect(() => {
    const fetchCepInfo = async () => {
      if (inputValue.cep.length === 9) {
        setIsCepLoading(true)

        try {
          const response = await fetch.getCepInfo(inputValue.cep)

          if (response.hasOwnProperty('cep')) {
            setCepInfo(response)
          } else {
            setCepInfo()
          }
        } finally {
          setIsCepLoading(false)
        }
      }
    }

    fetchCepInfo()
  }, [inputValue.cep])

  const handleInputValueChange = async (event) => {
    const input = event.target

    const inputValueOrMask = input.name === 'cep'
      ? input.value
        .replace(/[\D]/g, '')
        .replace(/([^]{5})([^])/, '$1-$2')
      : input.value

    setInputValue(previous => ({ ...previous, [input.name]: inputValueOrMask }))
  }

  const handleInputCepBlur = async () => {
    const inputCepMask = inputValue.cep
      .replace(/[\D]/g, '')
      .substring(0, 8)
      .padEnd(8, '0')
      .replace(/([^]{5})([^])/, '$1-$2')

    setInputValue(previous => ({ ...previous, cep: inputCepMask }))
  }

  return (
    <section className='cep-section'>
      <form className='cep-container'>
        <label className='cep-input-label'>CEP:
          <div className='cep-input-container'>
            <input className={`cep-input ${!cepInfo && inputValue.cep.length === 9 && 'invalid-input'}`} name='cep' value={inputValue.cep} placeholder='Número do CEP' disabled={isCepLoading} onChange={handleInputValueChange} onBlur={handleInputCepBlur} />

            {isCepLoading && <svg className='cep-loading' viewBox='0 0 32 32'><path d='M16.0002 26.6666C13.0446 26.6666 10.5279 25.6277 8.45016 23.5499C6.37239 21.4721 5.3335 18.9555 5.3335 15.9999C5.3335 13.0444 6.37239 10.5277 8.45016 8.44992C10.5279 6.37214 13.0446 5.33325 16.0002 5.33325C17.8891 5.33325 19.5446 5.71659 20.9668 6.48325C22.3891 7.24992 23.6224 8.29992 24.6668 9.63325V5.33325H26.6668V13.7999H18.2002V11.7999H23.8002C22.9557 10.4666 21.8779 9.38881 20.5668 8.56659C19.2557 7.74436 17.7335 7.33325 16.0002 7.33325C13.5779 7.33325 11.5279 8.17214 9.85016 9.84992C8.17238 11.5277 7.3335 13.5777 7.3335 15.9999C7.3335 18.4221 8.17238 20.4721 9.85016 22.1499C11.5279 23.8277 13.5779 24.6666 16.0002 24.6666C17.8446 24.6666 19.5335 24.1388 21.0668 23.0833C22.6002 22.0277 23.6668 20.6333 24.2668 18.8999H26.3335C25.6891 21.2333 24.4113 23.111 22.5002 24.5333C20.5891 25.9555 18.4224 26.6666 16.0002 26.6666Z' /></svg>}

            {inputValue.cep.length > 0
              && inputValue.cep.length !== 9
              && !isCepLoading
              && <p className='cep-warning'>O CEP deve possuir 8 números.</p>}

            {!cepInfo
              && inputValue.cep.length === 9
              && !isCepLoading
              && <p className='cep-error'>CEP não encontrado!</p>}
          </div>
        </label>

        <label className='cep-input-label'>Rua:
          <input className='cep-input' name='street' value={inputValue.street} placeholder='Nome da rua' disabled={isCepLoading} onChange={handleInputValueChange} />
        </label>

        <label className='cep-input-label'>Bairro:
          <input className='cep-input' name='district' value={inputValue.district} placeholder='Nome do bairro' disabled={isCepLoading} onChange={handleInputValueChange} />
        </label>

        <div className='cep-city-state-container'>
          <label className='cep-input-label'>Cidade:
            <input className='cep-input' name='city' value={inputValue.city} placeholder='Nome da cidade' disabled={isCepLoading} onChange={handleInputValueChange} />
          </label>

          <label className='cep-input-label'>Estado:
            <input className='cep-input' name='state' value={inputValue.state} placeholder='Sigla do estado' disabled={isCepLoading} onChange={handleInputValueChange} />
          </label>
        </div>
      </form>
    </section>
  )
}