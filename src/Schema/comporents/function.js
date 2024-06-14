export const errorMessages = ( fieldName ) =>
{
    return {
        "string.base": `${ fieldName } phải là chuỗi`,
        "string.empty": `${ fieldName } không được để trống`,
        "string.email": `${ fieldName } phải là email`,
        "string.min": `${ fieldName } phải dài hơn 6 ký tự`,

        "number.base": `${ fieldName } phải là số`,
        "number.empty": `${ fieldName } là bắt buộc`,
        "number.min": `${ fieldName } phải lớn hơn 0`,
        "number.max": `${ fieldName } phải nhỏ hơn hoặc bằng giá trị tối đa`,

        "array.base": `${ fieldName } phải là mảng`,
        "array.min": `${ fieldName } không được để trống`,
        "object.base": `${ fieldName } phải là đối tượng`,

        "any.required": `${ fieldName } là bắt buộc`,
        "any.only": `${ fieldName } không khớp`,
    }

}