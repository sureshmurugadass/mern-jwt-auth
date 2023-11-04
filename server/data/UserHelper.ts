import fs from "fs";
import User from "./User";

export function addUser(newUser: User) {
  const users = getAllUsers();
  const data = users ? [...users, newUser] : [newUser];
  fs.writeFileSync("./data/user.json", JSON.stringify(data, null, 2));
  return newUser;
}

export function updateUser(updatedUser: User) {
  const users = getAllUsers();
  const otherUsers = users?.filter((_item) => _item.id !== updatedUser.id);
  const data = otherUsers ? [...otherUsers, updatedUser] : [updatedUser];
  fs.writeFileSync("./data/user.json", JSON.stringify(data, null, 2));
  return updatedUser;
}

export function getAllUsers(): User[] | undefined {
  const jsonString = fs.readFileSync("./data/user.json", "utf8");
  if (jsonString) return JSON.parse(jsonString);
}

export function getUserById(id: string): User | undefined {
  const users = getAllUsers();
  const userById = users?.find((_item) => _item.id === id);
  if (userById) return userById;
}
export function getUserByEmail(email: string): User | undefined {
  const users = getAllUsers();
  const userById = users?.find((_item) => _item.email === email);
  if (userById) return userById;
}

export function deleteUserById(id: string): User[] | undefined {
  const users = getAllUsers();
  const otherUsers = users?.filter((_item) => _item.id !== id);
  fs.writeFileSync("./data/user.json", JSON.stringify(otherUsers));
  return otherUsers;
}

function createFile() {}
