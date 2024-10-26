namespace JobLink_Backend.Entities;

using System.ComponentModel;

public enum Bank
{
    [Description("MB - NH TMCP QUAN DOI")] Mb,

    [Description("VIETCOMBANK - NH TMCP NGOAI THUONG VIET NAM (VCB)")]
    Vietcombank,

    [Description("VIETINBANK - NH TMCP CONG THUONG VIET NAM")]
    Vietinbank,

    [Description("ABBANK - NH TMCP AN BINH (ABB)")]
    Abbank,

    [Description("ACB - NH TMCP A CHAU")] Acb,

    [Description("AGRIBANK - NH NN - PTNT VIET NAM")]
    Agribank,

    [Description("BANVIET - NH TMCP BAN VIET")]
    Banviet,

    [Description("BAOVIETBANK - NH TMCP BAO VIET (BVB)")]
    Baovietbank,

    [Description("BIDV - NH DAU TU VA PHAT TRIEN VIET NAM")]
    Bidv,

    [Description("CBBANK - NH TM TNHH MTV XAY DUNG VIET NAM")]
    Cbbank,

    [Description("CITIBANK VIETNAM - NH TNHH MTV CITIBANK VIET NAM")]
    CitibankVietnam,

    [Description("DONGABANK - NH TMCP DONG A")]
    Dongabank,

    [Description("EXIMBANK - NH TMCP XUAT NHAP KHAU VIET NAM (EIB)")]
    Eximbank,

    [Description("GPBANK - NH TMCP GUANGZHOU (VIET NAM)")]
    Gpbank,

    [Description("HDBANK - NH TMCP PHAT TRIEN TP HO CHI MINH (HDB)")]
    Hdbank,

    [Description("HSBC VIETNAM - NH TNHH MTV HANG HAI (VIET NAM)")]
    HsbcVietnam,

    [Description("INDOVINABANK - NH TMCP INDONESIA VIET NAM (IVB)")]
    Indovinabank,

    [Description("KIENLONGBANK - NH TMCP KIEN LONG")]
    Kienlongbank,

    [Description("LIENVIETPOSTBANK - NH TMCP BUU DIEN LIEN VIET")]
    Lienvietpostbank,

    [Description("MARIANNA BANK - NH TMCP ĐẦU TƯ VÀ PHÁT TRIEN NAM VIỆT")]
    MariannaBank,

    [Description("MSB - NH TMCP HANG HAI (MSB)")]
    Msb,

    [Description("NAMABANK - NH TMCP NAM A")]
    Namabank,

    [Description("NCB - NH TMCP QUOC DAN")]
    Ncb,

    [Description("OCB - NH TMCP PHUONG DONG (OCB)")]
    Ocb,

    [Description("PGBANK - NH TMCP XUONG TRANG VA XAY DUNG VIET NAM")]
    Pgbank,

    [Description("PVCOMBANK - NH TMCP DAU TU VA PHAT TRIEN VIET NAM (PVCOMBANK)")]
    Pvcombank,

    [Description("SAIGONBANK - NH TMCP SAI GON (SCB)")]
    Saigonbank,

    [Description("SACOMBANK - NH TMCP SAI GON THUONG TIN")]
    Sacombank,

    [Description("SEABANK - NH TMCP DONG NAM A (SEABANK)")]
    Seabank,

    [Description("SHB - NH TMCP SAIGON HA NOI")]
    Shb,

    [Description("SHINHANBANK - NH TNHH MTV SHINHAN VIET NAM")]
    Shinhanbank,

    [Description("TECHCOMBANK - NH TMCP KY THUAT VIET NAM (TCB)")]
    Techcombank,

    [Description("TPBANK - NH TMCP TIEN PHONG")]
    Tpbank,

    [Description("TRUSTBANK - NH TMCP TIN NGHIA")]
    Trustbank,

    [Description("VIB - NH TMCP QUOC TE VIET")]
    Vib,

    [Description("VRB - NH TMCP KHOANG SAN VIET NAM")]
    Vrb,

    [Description("WOORIBANK - NH TMCP WOORI HAN VIE")]
    Wooribank
}