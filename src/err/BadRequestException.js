class BadRequestException extends Error {
    constructor(message) {
        super(message)
        this.message = message || 'Error'
        this.name = this.name || 'Error'
        this.status = 400
    }
}
module.exports = BadRequestException