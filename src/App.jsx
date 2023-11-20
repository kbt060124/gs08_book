import { useEffect, useState } from "react";
import "./App.css";

// const baseUrl ='http://localhost/00_GS/01_assignment/08_book/react_todo/'
const baseUrl ='https://kkgsacademy.sakura.ne.jp/gs08_book/'

function App() {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const formData = new FormData();
    formData.append('todo', todo);

    useEffect(() => {
        fetchTodos()
    },[todos])

    const fetchTodos = async() => {
        const todos = await fetch(baseUrl+'getTodos.php')
        const string = await todos.text();
        const json = string === "" ? {} : JSON.parse(string);
        setTodos(json.data);
        // const response = await todos.json();
        // setTodos(response.data);
    }

    const addTodo = async() => {
        const todos = await fetch(baseUrl+'addTodo.php',{
            method:'POST',
            body:formData
        })
        const string = await todos.text();
        const json = string === "" ? {} : JSON.parse(string);
        // const response = await todos.json()
        // if (response.success) {
        if (json.success) {
                fetchTodos()
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        addTodo();

        // const newTodos = todos;
        // // newTodos.push(todo);
        // newTodos.splice(0,0, todo);
        // setTodos([...newTodos]);

        setTodo("");
    };

    const deleteTodo = async(id) => {
        // console.log('ID', id);
        const formData = new FormData();

        formData.append('id', id);

        const resp = await fetch(baseUrl + 'deleteTodo.php', {
            method: 'POST',
            body: formData
        })

        const string = await resp.text();
        const json = string === "" ? {} : JSON.parse(string);
        // const response = await todos.json()
        // if (response.success) {
        if (json.success) {
            fetchTodos()
        }

    };

    const editTodo = async(id, todo) => {
        // console.log('ID', id);
        const formData = new FormData();

        formData.append('id', id);
        formData.append('todo', todo);

        const resp = await fetch(baseUrl + 'editTodo.php', {
            method: 'POST',
            body: formData
        })

        const string = await resp.text();
        const json = string === "" ? {} : JSON.parse(string);
        // const response = await todos.json()
        // if (response.success) {
        if (json.success) {
            fetchTodos()
        }

    };

    return (
        <div className="ml-3 mt-3">
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        value={todo}
                        onChange={(e) => {
                            setTodo(e.target.value);
                        }}
                        className="bg-gray-200"
                    />
                    <button type="submit" className="ml-2 bg-red-600 hover:bg-red-500 text-white rounded px-4 py-2">
                        Add
                    </button>
                </div>
            </form>
            <div>
                {todos.map((item, index) => {
                    // console.log(item);
                    // return (
                    //     <p>{index}</p>
                    // );
                    return (
                        <Todo
                            key={item.id}
                            index={item.id}
                            item={item.todo}
                            deleteTodo={(id) => {
                                deleteTodo(id);
                            }}
                            editTodo={(todo) => {
                                editTodo(item.id, todo);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default App;

const Todo = ({ item, deleteTodo, index, editTodo }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [todo, setTodo] = useState(item);

    const handleSubmit = (e) => {
        e.preventDefault();
        editTodo(todo);
        setIsEdit(false);
    };

    return (
        <div className="mt-3" key={index}>
            <div>
                <div className="flex items-center">
                    <p>{index}．</p>
                    {isEdit ? (
                        <form onSubmit={handleSubmit}>
                            <div className="flex">
                                <input
                                    className=""
                                    value={todo}
                                    onChange={(e) => {
                                        setTodo(e.target.value);
                                    }}
                                />
                                <button type="submit" className="bg-green-500 hover:bg-green-400 text-white rounded px-4 py-2">
                                    Edit
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="">{item}</p>
                    )}
                    <div>
                        <button
                            className="ml-2 bg-blue-800 hover:bg-blue-700 text-white rounded px-4 py-2"
                            onClick={() => {
                                setIsEdit((prev) => !prev);
                            }}
                        >
                            {isEdit ? "Cancel" : "Edit"}
                        </button>
                        <button
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded px-4 py-2"
                            onClick={() => {
                                deleteTodo(index);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
