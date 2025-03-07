import { ApiProperty } from '@nestjs/swagger';

export class AnonymityCheckDto {
  @ApiProperty({ example: '98.109.187.123', description: 'Ваш IP адрес' })
  ip: string;

  @ApiProperty({ example: 'Russia (RU)', description: 'Страна по IP' })
  country: string;

  @ApiProperty({ example: 'Moscow', description: 'Город по IP' })
  city: string;

  @ApiProperty({ example: '460000', description: 'Почтовый индекс' })
  postalCode: string;

  @ApiProperty({ example: '51.7898, 55.0984', description: 'Координаты' })
  coordinates: string;

  @ApiProperty({ example: 'Windows', description: 'Операционная система' })
  os: string;

  @ApiProperty({ example: 'Chrome 92.0.4515.159', description: 'Браузер' })
  browser: string;

  @ApiProperty({
    example: 'Asia/Yekaterinburg',
    description: 'Временная зона IP',
  })
  timezone: string;

  @ApiProperty({ example: '04-09-2021, 13:49', description: 'Время по IP' })
  ipTime: string;

  @ApiProperty({ example: '04-09-2021, 13:54', description: 'Системное время' })
  systemTime: string;

  @ApiProperty({
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    description: 'UserAgent',
  })
  userAgent: string;

  @ApiProperty({
    example: true,
    description: 'Совпадает ли UserAgent JS с UserAgent',
  })
  userAgentMatch: boolean;

  @ApiProperty({
    example: 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    description: 'Язык браузера',
  })
  browserLanguage: string;

  @ApiProperty({
    example: '2048x1152, 24 бита',
    description: 'Разрешение экрана',
  })
  screenResolution: string;

  @ApiProperty({ example: 80, description: 'Уровень анонимности (0-100%)' })
  anonymityLevel: number;

  @ApiProperty({ example: false, description: 'Используется ли прокси' })
  isProxy: boolean;

  @ApiProperty({ example: false, description: 'Используется ли VPN' })
  isVpn: boolean;

  @ApiProperty({ example: false, description: 'Используется ли Tor' })
  isTor: boolean;

  @ApiProperty({ example: false, description: 'Используется ли анонимайзер' })
  isAnonymizer: boolean;

  @ApiProperty({
    example: true,
    description: 'Находится ли IP в черном списке',
  })
  isBlacklisted: boolean;

  @ApiProperty({ example: false, description: 'Включен ли Flash' })
  isFlashEnabled: boolean;

  @ApiProperty({ example: false, description: 'Включена ли Java' })
  isJavaEnabled: boolean;

  @ApiProperty({ example: false, description: 'Включен ли ActiveX' })
  isActiveXEnabled: boolean;

  @ApiProperty({ example: true, description: 'Включен ли WebRTC' })
  isWebRtcEnabled: boolean;

  @ApiProperty({
    example: ['192.168.1.1'],
    description: 'IP адреса через WebRTC',
  })
  webRtcIps: string[];

  @ApiProperty({
    example: 10,
    description: 'Количество проверок IP',
  })
  checksCount: number;

  @ApiProperty({
    example: 2,
    description: 'Количество попаданий в черный список',
  })
  blacklistCount: number;
}
