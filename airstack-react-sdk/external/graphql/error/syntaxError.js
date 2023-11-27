import { GraphQLError } from "./GraphQLError.js";
function syntaxError(source, position, description) {
  return new GraphQLError(`Syntax Error: ${description}`, {
    source,
    positions: [position]
  });
}
export {
  syntaxError
};
