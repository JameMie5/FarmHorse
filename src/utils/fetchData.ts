export const fetchData = async (path: string, method: string = 'GET', data: any = null, auth: string = '') => {
  try {
    const _data: any = {
      path,
      method,
    }
    const _header: any = {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    }
    if (method !== 'GET') {
      _data.data = JSON.stringify(data)
    }
    // Authorization: `Bearer ${session?.data.accessToken}`,
    if (auth !== '') {
      _header.Authorization = `Bearer ${auth}`
    }
    const _res = await fetch('/api', {
      method: 'POST',
      headers: _header,
      body: JSON.stringify(_data),
    })
    const _return = _res ? await _res.json() : {}
    return _return
  } catch (error) {
    console.log('utils fetchData error', error)
    return {}
  }
}
