'use strict'

module.exports = app => {
    const Token = app.model.define('token', {
        id: { type: app.Sequelize.BIGINT, field: 'id', primaryKey: true, autoIncrement: true },
        address: { type: app.Sequelize.STRING, field: 'address' },
        marketcapHistory: { type: app.Sequelize.JSON, field: 'marketcap_history' },
    });

    Token.newData = async tokenAddress => {
        try {
            app.logger.info('[DbLayer][Token.newData] req: %s', tokenAddress)

            const [ token, created ] = await Token.findOrCreate({
                where: {
                    address: tokenAddress,
                },
                default: {
                    address: tokenAddress,
                }
            })

            return created
        } catch (err) {
            app.logger.error('[DbLayer][Token.newData] req, %s, err: %s', tokenAddress, err.message)
            throw err
        }
    }

    return Token
}