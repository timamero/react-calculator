import { evaluate } from "mathjs"

const calculateEquation = equation => {
  const answer = evaluate(equation.replace('(-)', '-'))
  return answer
}

export default calculateEquation