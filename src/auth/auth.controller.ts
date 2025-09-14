import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User with this email already exists',
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error',
  })
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully signed in',
    type: AuthResponseDto,
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error',
  })
  async signin(@Body() signinDto: SigninDto): Promise<AuthResponseDto> {
    return this.authService.signin(signinDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged out',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully logged out' }
      }
    }
  })
  logout() {
    return { message: 'Successfully logged out' };
  }

}
