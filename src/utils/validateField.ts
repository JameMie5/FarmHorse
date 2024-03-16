interface IRegex {
  key: string
  data: RegExp
}

const regex: IRegex[] = [
  {
    key: 'userName',
    data: /^[a-zA-Z0-9._-]{6,}$/,
  },
  {
    key: 'fullName',
    // data: /^[A-Za-z\u0E00-\u0E7F]+(?:\s[A-Za-z\u0E00-\u0E7F]+)*$/,
    data: /^[A-Za-z\u0E00-\u0E7F]+(\s[A-Za-z\u0E00-\u0E7F]+)*$/,
  },
  {
    key: 'text',
    data: /^[A-Za-z0-9\s\u0E00-\u0E7F]{6,}$/,
  },
  {
    key: 'email',
    data: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  {
    key: 'phone',
    data: /^\d{8,16}$/,
  },
  {
    key: 'notBlank',
    data: /^.+$/g,
  },
  {
    key: 'trueOnly',
    data: /^(true)$/i,
  },
  {
    key: 'password',
    data: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]).{8,}$/,
  },
  {
    key: 'date',
    data: /^\d{4}-\d{2}-\d{2}$/,
  },
  {
    key: 'idCard',
    data: /^[0-9]{13}$/,
  },
  {
    key: 'bankNumber',
    data: /^\d{10,14}$/,
  },
]

export interface IDataValidate {
  key: string
  type: 'userName' | 'fullName' | 'email' | 'phone' | 'notBlank' | 'trueOnly' | 'same' | 'password' | 'text' | 'date' | 'idCard' | 'bankNumber'
  value: any
}

export interface IDataValidateReturn {
  status: boolean
  data: string[]
}

export const validateField = (data: IDataValidate[]): IDataValidateReturn => {
  // type = username, fullname, email, phone, notBlank

  const _arrError = []
  for (const _field of data) {
    if (_field.type !== 'same') {
      const _findRegex = regex.find((e: IRegex) => e.key === _field.type)
      if (_findRegex) {
        const _test = new RegExp(_findRegex?.data).test(_field.value)
        console.log('regex', _field.type, _test, _field.value)
        if (!_test) {
          _arrError.push(_field.key)
        }
      }
    } else {
      if (!Array.isArray(_field.value) || _field.value.length !== 2 || _field.value[0] !== _field.value[1]) {
        _arrError.push(_field.key)
      }
    }
  }
  return {
    status: !(_arrError.length > 0),
    data: _arrError,
  }
}

export const checkValidateField = (list: string[], key: string): boolean => {
  return !!list.find((e: string) => e === key)
}

export const removeErrorValidateField = (list: string[], key: string) => {
  return list.filter((e: string) => e !== key && e !== `cannotUse_${key}`)
}
