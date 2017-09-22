export class SerializationHelper {
    static toInstance<T>(obj: T, json: string) : T {
        var jsonObj = JSON.parse(json);

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
}