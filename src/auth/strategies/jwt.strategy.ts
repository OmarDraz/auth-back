import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    this.logger.log(`JWT validation for user ID: ${payload.sub}`);
    
    const user = await this.userModel.findById(payload.sub).select('-password');
    if (!user) {
      this.logger.warn(`JWT validation failed: User with ID ${payload.sub} not found`);
      throw new UnauthorizedException('User not found');
    }
    
    this.logger.log(`JWT validation successful for user: ${user.email}`);
    return user;
  }
}
