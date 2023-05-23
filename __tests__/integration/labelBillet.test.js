/* eslint-disable no-undef */
const server = require('../../src/app')
const request = require('supertest')

describe('Tests BarCode/Boleto', () => {
  it('Should be consumption billet validated --success Case', async () => {
    const response = await request(server).get(
      '/boleto/846200000004249002951005013225568578922069839327'
    )
    expect(response.status).toBe(200)
    expect(response.body.barCode).toBe(
      '84620000000249002951000132255685792206983932'
    )
  })

  it('Should be consumption billet validated. Remove special characters --success Case', async () => {
    const response = await request(server).get(
      '/boleto/84620000000-4.2490=0295100-5.01=322556857-8.92206983932-7'
    )
    expect(response.status).toBe(200)
    expect(Number(response.body.amount)).toBeGreaterThan(24)
  })

  it('Should be consumption billet validated. Special rule to return 1 --success Case', async () => {
    const response = await request(server).get(
      '/boleto/86610000000-3 .2490=0295100-5.01=322556857-8.92206983932-7'
    )
    expect(response.status).toBe(200)
    expect(response.body.expirationDate).toBeNull()
  })

  it('Should be consumption billet validated. Using module 11 calculation --success Case', async () => {
    const response = await request(server).get(
      '/boleto/829 0 0000000.2-22222222222.6-44444444444.2-66666666666.2'
    )
    expect(response.status).toBe(200)
    expect(response.body.barCode).toBe(
      '82900000000222222222224444444444466666666666'
    )
  })

  it('Should be consumption billet validated. Using module 11 calculation - Special rule to return 1 --success Case', async () => {
    const response = await request(server).get(
      '/boleto/899 1 0000000.4-22222222222.6-44444444444.2-66666666666.2'
    )
    expect(response.status).toBe(200)
    expect(response.body.expirationDate).toBeNull()
  })

  it('Should be consumption billet validated. With valid expiration date in position 20 --success Case', async () => {
    const response = await request(server).get(
      '/boleto/84670000000-9.24900295202-9.21022556857-0.92206983932-7'
    )
    expect(response.status).toBe(200)
    //expect(response.body.expirationDate).toBe('2022-10-22')
  })

  it('Should be consumption billet validated. With valid expiration date in over 10 years --success Case', async () => {
    const response = await request(server).get(
      '/boleto/84630000000-3.24900295204-5.21022556857-0.92206983932-7'
    )
    expect(response.status).toBe(200)
    expect(response.body.expirationDate).toBe(null)
  })

  it('Should be consumption billet validated. With valid expiration date in position 24 --success Case', async () => {
    const response = await request(server).get(
      '/boleto/84640000000-2.24900295999-0.00202305297-6.92206983932-7'
    )
    expect(response.status).toBe(200)
    expect(response.body.expirationDate).toBe('2023-05-29')
  })

  it('Should be billing billet validated --success Case', async () => {
    const response = await request(server).get(
      '/boleto/00190500954014481606906809350314337370000000100'
    )
    expect(response.status).toBe(200)
    expect(Number(response.body.amount)).toEqual(1)
  })

  it('Should be billing billet validated. Remove special characters --success Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.40144.81606.9-0680935031.4-3.37370000000100'
    )
    expect(response.status).toBe(200)
    expect(response.body.barCode).toBe(
      '00193373700000001000500940144816060680935031'
    )
  })

  it('Should be billing billet validated. With DV equal at [0, 10, 11], in case 10 --success Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.40144.81606.9-3680935031.1-1.00000000000100'
    )
    expect(response.status).toBe(200)
    expect(response.body.barCode).toBe(
      '00191000000000001000500940144816063680935031'
    )
  })

  it('Should be billing billet validated. Empty expirationDate  --success Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.40144.81606.9-0680935031.4-8.00000000000100'
    )
    expect(response.status).toBe(200)
    expect(response.body.expirationDate).toBe(null)
  })

  it('Not Should be billing billet validated. Invalid URL access *case 1 --FAIL Case', async () => {
    const response = await request(server).get('/')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Not Found')
  })

  it('Not Should be billing billet validated. Invalid URL access  *case 2 --FAIL Case', async () => {
    const response = await request(server).get('/teste')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Not Found')
  })

  it('Not Should be billing billet validated. Not send barcode --FAIL Case', async () => {
    const response = await request(server).get('/boleto')
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-001/)
  })

  it('Not Should be billing billet validated. Invalid barcode size --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.40144.81606.9-0680935031.4-3'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-002/)
  })

  it('Not Should be billing billet validated. First part check digit error  --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/00190510954014481606906809350314337370000000100'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-101/)
  })

  it('Not Should be billing billet validated. Second part check digit error  --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.4014481606.7-0680935031.4-3.37370000000100'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-102/)
  })

  it('Not Should be billing billet validated. Third part check digit error  --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.4014481606.9-0680935031.1-3.37370000000100'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-103/)
  })

  it('Not Should be consumption billet validated. Fourth part check digit error  --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/84670000000-9.24900295202-9.21022556857-0.92206983932-4'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-104/)
  })

  it('Not Should be consumption billet validated. DV check digit error  --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/84680000000-9.24900295202-9.21022556857-0.92206983932-7'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-10DV/)
  })

  it('Not Should be billing billet validated. DV check digit error --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/001905009-5.4014481606.9-0680935031.4-4.37370000000100'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-10DV/)
  })

  it('Not Should be consumption billet validated. Special validation in position 2 --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/80680000000-9.24900295202-9.21022556857-0.92206983932-7'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-101.2/)
  })

  it('Not Should be consumption billet validated. Special validation in position 2 --FAIL Case', async () => {
    const response = await request(server).get(
      '/boleto/84280000000-9.24900295202-9.21022556857-0.92206983932-7'
    )
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Err-101.3/)
  })
})
