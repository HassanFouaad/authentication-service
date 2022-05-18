import { ObjectId } from "mongoose";
import User from "../../../../models/user.model";
import Role from "../../../../models/role.model";
import { roles } from "../../../../constants/rolesAndPermissions";

class UserRepository {
  private model;

  constructor(model: typeof User) {
    this.model = model;
  }

  async findUserById(id: ObjectId) {
    const user = await this.model.findById(id);
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.model.findOne({
      username,
    });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.model.findOne({ email });
    return user;
  }

  async create(userData: {
    username: string;
    name: string;
    email: string;
    password: string;
    roleId?: ObjectId;
  }) {
    const { roleId } = userData;
    let role;
    if (roleId) {
      let role = await Role.findById(roleId);
      if (!role) throw Error("Role not found");
    } else {
      role = await Role.findOne({ name: roles.user.name });
      role = role?.id;
    }
    const user = await this.model.create({ ...userData, role });

    return user;
  }
}

const userRepo = new UserRepository(User);

export default userRepo;
