const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const { Users } = require("./Users");
const { Todos } = require("./Todos");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }
            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                userId: ID
                user: User
            }
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    return Users.find((e)=> e.id == todo.userId);
                    // return (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data;
                }
            },
            Query: {
                getTodos: async () => {
                    return Todos;
                },
                getAllUsers: async () => {
                    return Users;
                },
                getUser: async (parent, { id }) => {
                    return Users.find((e) => e.id === id);
                }
            }
        }
    });

    app.use(cors());
    app.use(bodyParser.json());

    await server.start();
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => {
        console.log("server started in port 8000");
    })
}

startServer();