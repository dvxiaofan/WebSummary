using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace DX_DataInterface.Models
{
    public static class StaticAES
    {
        private const string UserKey = "roshan-2018-user";              //密钥,128位 
        private static readonly byte[] UserIv = { 5, 4, 0xF, 7, 9, 0xC, 1, 0xB, 3, 0x5B, 0xD, 0x17, 1, 0xA, 6, 8 };



        //加密
        public static string AESEncrypt(string toEncrypt)
        {
            try
            {
                return AESEncrypt(toEncrypt, UserKey, UserIv);
            }
            catch (Exception e)
            {
                return "加密错误";
            }
        }


        //解密
        public static string AESDecrypt(string toDecrypt)
        {
            try
            {
                return AESDecrypt(toDecrypt, UserKey, UserIv);
            }
            catch (Exception e)
            {
                return "解密错误";
            }
        }

        /// <summary>
        /// 加密
        /// </summary>
        /// <param name="toEncrypt">明文</param>
        /// <param name="key">秘钥</param>
        /// <param name="ivBytes">向量</param>
        /// <returns>密文</returns>
        public static string AESEncrypt(string toEncrypt, string key, byte[] ivBytes)
        {
            try
            {
                byte[] toEncryptBytes = System.Text.Encoding.UTF8.GetBytes(toEncrypt);
                var rijndael = new RijndaelManaged();
                rijndael.Key = System.Text.Encoding.UTF8.GetBytes(key);
                rijndael.IV = ivBytes;
                //rijndael.Padding = PaddingMode.Zeros;   //要解密的字符串长度应该是4的整数倍，如果不是整数倍，就会抛出异常：要解密的数据的长度无效。 这时就需要设置填充模式
                ICryptoTransform cryptoTransform = rijndael.CreateEncryptor();
                byte[] resultBytes = cryptoTransform.TransformFinalBlock(toEncryptBytes, 0, toEncryptBytes.Length);
                return Convert.ToBase64String(resultBytes);
            }
            catch (Exception e)
            {
                return "加密错误";
            }
        }

        /// <summary>
        /// 解密
        /// </summary>
        /// <param name="toDecrypt">密文</param>
        /// <param name="key">秘钥</param>
        /// <param name="ivBytes">向量</param>
        /// <returns>明文</returns>
        private static string AESDecrypt(string toDecrypt, string key, byte[] ivBytes)
        {
            try
            {
                byte[] toDecryptBytes = Convert.FromBase64String(toDecrypt);
                var rijndael = new RijndaelManaged();
                rijndael.Key = System.Text.Encoding.UTF8.GetBytes(key);
                rijndael.IV = ivBytes;
                //rijndael.Padding = PaddingMode.Zeros;   //要解密的字符串长度应该是4的整数倍，如果不是整数倍，就会抛出异常：要解密的数据的长度无效。 这时就需要设置填充模式
                ICryptoTransform cryptoTransform = rijndael.CreateDecryptor();
                byte[] resultArray = cryptoTransform.TransformFinalBlock(toDecryptBytes, 0, toDecryptBytes.Length);
                return System.Text.Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception e)
            {
                return "解密错误";
            }


        }

       



    }
}