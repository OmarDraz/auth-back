import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    this.logger.log(`Signup attempt for email: ${signupDto.email}`);

    try {
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email: signupDto.email });
      if (existingUser) {
        this.logger.warn(`Signup failed: User with email ${signupDto.email} already exists`);
        throw new ConflictException('User with this email already exists');
      }

      const user = new this.userModel(signupDto);
      await user.save();

      this.logger.log(`User successfully created with ID: ${user._id}`);

      const payload = { sub: user._id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      this.logger.log(`JWT token generated for user: ${user.email}`);

      return {
        access_token,
        user: {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      this.logger.error(`Signup error for email ${signupDto.email}:`, error.message);
      throw error;
    }
  }

  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    this.logger.log(`Signin attempt for email: ${signinDto.email}`);

    try {
      // Find user and include password for comparison
      const user = await this.userModel.findOne({ email: signinDto.email }).select('+password');
      if (!user) {
        this.logger.warn(`Signin failed: User with email ${signinDto.email} not found`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const bcrypt = require('bcrypt');
      const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Signin failed: Invalid password for email ${signinDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      this.logger.log(`User successfully signed in with ID: ${user._id}`);

      const payload = { sub: user._id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      this.logger.log(`JWT token generated for user: ${user.email}`);

      return {
        access_token,
        user: {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      this.logger.error(`Signin error for email ${signinDto.email}:`, error.message);
      throw error;
    }
  }

  async validateUser(userId: string): Promise<any> {
    this.logger.log(`Validating user with ID: ${userId}`);
    
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      this.logger.warn(`User validation failed: User with ID ${userId} not found`);
      throw new UnauthorizedException('User not found');
    }

    this.logger.log(`User validation successful for ID: ${userId}`);
    return user;
  }
}
