import { createParamDecorator, BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const GetToken = createParamDecorator((data, req: Request): string => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    throw new BadRequestException("No Access Token");
  }

  return accessToken.split("Bearer ")[1];
});

export const GetRefreshToken = createParamDecorator(
  (data, req: Request): string => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException("No Refresh Token");
    }

    return refreshToken;
  }
);
