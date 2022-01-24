const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

const axios = require('axios');

const CompanyType = new GraphQLObjectType({
    name:"Company",
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return(axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(resp => resp.data));
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name:"User",
    fields: () => ({
        id: {type: GraphQLInt},
        first_name: {type: GraphQLString},
        last_name: {type: GraphQLString},
        email: {type: GraphQLString},
        gender: {type: GraphQLString},
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                return(axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(resp => resp.data));
            }
        },
        ip_address: {type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        User: {
            type: UserType,
            args: {id: {type: GraphQLInt}},
            resolve(parentValue, args){
                return(axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data));
            }
        },
        Company: {
            type: CompanyType,
            args: {id: {type: GraphQLInt}},
            resolve(parentValue, args){
                return(axios.get(`http://localhost:3000/companies/${args.id}`).then(resp => resp.data));
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
