import { User, UserModel } from "./user.model";
import { ObjectId } from "mongodb";
import {
  CreateUserDto,
  UserId,
  UpdateUserDto,
} from "./user.dto";

export async function createUser(user: CreateUserDto): Promise<User> {
  return UserModel.create(user);
}

export async function updateUser(
  id: UserId,
  data: UpdateUserDto
): Promise<User | null> {
  return UserModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteUser(id: UserId): Promise<User | null> {
  return UserModel.findByIdAndDelete(id);
}

export async function getUserById(id: UserId): Promise<User | null> {
  return UserModel.findById(id);
}

export async function getUserRoleById(id: UserId) {
  return UserModel.findById(id).select("role");
}

export async function updateFavoriteCarsIdToUser(
  id: UserId,
  favoriteCarsId: Array<ObjectId>
): Promise<User | null> {
  return UserModel.findByIdAndUpdate(id, { favoriteCarsId }, { new: true });
}

export async function deleteFavoriteCarsIdToUser(id: UserId) {
  return UserModel.findByIdAndUpdate(
    id,
    { set: { favoriteCarsId: null } },
    { new: true }
  );
}
