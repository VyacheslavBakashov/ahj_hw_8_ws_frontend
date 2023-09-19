/* eslint-disable consistent-return */
export default class Request {
  constructor(port) {
    this.port = port;
    // this.httpURL = `http://localhost:${port}`;
    // this.wsURL = `ws://localhost:${port}`;
    this.httpURL = 'https://ahj-hw-8-bvv.onrender.com';
    this.wsURL = 'wss://ahj-hw-8-bvv.onrender.com';
  }

  async postNewUser(payload) {
    try {
      const response = await fetch(`${this.httpURL}/new-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        return;
      }
      return await response.json();
    } catch {
      return { status: 500, message: 'Network error' };
    }
  }
}
