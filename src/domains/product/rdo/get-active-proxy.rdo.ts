export interface ActiveProxy {
  status: 'success';
  data: {
    ipv4: [];
    ipv6: [];
    mobile: [];
    isp: [];
    mix: [];
    mix_isp: [];
    resident: [];
  };
  errors: [];
}
export enum ActiveProxyType {
  ipv4 = 'ipv4',
  ipv6 = 'ipv6',
  mobile = 'mobile',
  isp = 'isp',
  mix = 'mix',
  mix_isp = 'mix_isp',
  resident = 'resident',
}
