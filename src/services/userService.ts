import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ================= DTO DEFINITIONS ================= */

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

/* ================= TOKEN GENERATORS ================= */

const generateAccessToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

/* ================= USER SERVICE ================= */

class UserService {
  /* ================= REGISTER ================= */

  async register(data: RegisterDTO) {
    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const safeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        addresses: true,
        createdAt: true,
      },
    });

    return { user: safeUser, accessToken, refreshToken };
  }

  /* ================= LOGIN ================= */

  async login(data: LoginDTO) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const safeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        addresses: true,
        createdAt: true,
      },
    });

    return { user: safeUser, accessToken, refreshToken };
  }

  /* ================= REFRESH ================= */

  async refresh(token: string) {
    if (!token) throw new Error("No refresh token");

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== token) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    return { accessToken: newAccessToken };
  }

  /* ================= LOGOUT ================= */

  async logout(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  /* ================= PROFILE ================= */

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        addresses: true,
        createdAt: true,
      },
    });

    if (!user) throw new Error("User not found");

    return user;
  }

  /* ================= ADD ADDRESS ================= */

  async addAddress(userId: string, address: AddressDTO) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    await prisma.address.create({
      data: {
        ...address,
        userId,
      },
    });

    return await this.getProfile(userId);
  }
}

export default new UserService();