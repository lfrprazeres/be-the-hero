const connection = require('../database/connection');

module.exports = {
    async index(request, response) {

        const { page = 1 } = request.query;

        const [ count ] = await connection('incidents').count(); // conta quantos incidentes recebe

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5) // limitar a 5 registros, para paginação
            .offset((page - 1) * 5) // para pular tantos registros, exemplo com page = 2, 2 - 1 * 5 = 5
            .select([ // caso fosse só select("*") o id da ong vai sobrepujar o id do incidents
                'incidents.*', // pega tudo da table incidents
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response
            .header( // adicionar um valor ao header
                'X-Total-Count', // nome do valor
                count['count(*)'] // count recebido do backend
            );

        return response.json(incidents);
    },
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [ id ] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });

    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents') // buscar na tabela incidents
            .where('id', id) // onde o id é igual ao id que solicitou a remoção
            .select('ong_id') // pegar somente o campo ong_id
            .first(); // pegar o primeiro resultado, já que sabemos que só vai ser retornado um, pois ID é primary

            if( incident.ong_id !== ong_id ) {
                return response.status(401).json({ error: 'Operation not permitted.' });
            }

            await connection('incidents').where('id', id).delete();
            
            return response.status(204).send();
    }
}