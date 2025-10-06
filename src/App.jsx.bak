import { Box, Heading } from "@chakra-ui/react";
import { FormTodo } from "./components/FormTodo";
import { ListTodos } from "./components/ListTodos";
import { useState } from "react";

function App() {
	const [todos, setTodos] = useState([]);

	const addTodo = (todo) => {
		setTodos((prev) => [...prev, todo]);
	};

	const updateTodo = (todoIndex) => {
		if ((typeof todoIndex !== "number") | (todoIndex < 0)) {
			return;
		}
		const todo = todos[todoIndex]; //la todo que se quiere actualizar
		const newTodos = [...todos]; //una copia del estado de todos
		const updateTodo = { ...todo, isComplete: !todo.isComplete }; //la todo pasa de true a false y viceversa
		newTodos[todoIndex] = updateTodo; //insertamos la nueva todo actualizada
		setTodos(newTodos); //seteamos el estado con el array de todos que tiene la todo actualizada
	};
	return (
		<Box
			w="100%"
			h="100%"
			minH="100vh"
			bgColor="#1a202c"
			color="#cbd5e0"
			py="5vh"
			px={{ base: "12vw", lg: "30vw", md: "15vw" }}
		>
			<Heading size="3xl" mb="10">
				Todo App
			</Heading>
			<FormTodo addTodo={addTodo} />
			<ListTodos todos={todos} updateTodo={updateTodo} />
		</Box>
	);
}

export default App;
