import {
    FormBuilderStorageOperationsCreateSystemParams,
    FormBuilderStorageOperationsGetSystemParams,
    FormBuilderStorageOperationsUpdateSystemParams,
    System
} from "@webiny/api-form-builder/types";
import { Entity, Table } from "dynamodb-toolbox";
import { FormBuilderSystemCreateKeysParams, FormBuilderSystemStorageOperations } from "~/types";
import { cleanupItem } from "@webiny/db-dynamodb/utils/cleanup";
import WebinyError from "@webiny/error";

export interface CreateSystemStorageOperationsParams {
    entity: Entity<any>;
    table: Table;
}

export const createSystemStorageOperations = (
    params: CreateSystemStorageOperationsParams
): FormBuilderSystemStorageOperations => {
    const { entity } = params;

    const createSystemPartitionKey = ({ tenant }: FormBuilderSystemCreateKeysParams): string => {
        return `T#${tenant}#SYSTEM`;
    };

    const createSystemSortKey = (): string => {
        return "FB";
    };

    const createKeys = (params: FormBuilderSystemCreateKeysParams) => {
        return {
            PK: createSystemPartitionKey(params),
            SK: createSystemSortKey()
        };
    };

    const createSystem = async (
        params: FormBuilderStorageOperationsCreateSystemParams
    ): Promise<System> => {
        const { system } = params;
        const keys = createKeys(system);

        try {
            await entity.put({
                ...system,
                ...keys
            });
            return system;
        } catch (ex) {
            throw new WebinyError(
                ex.message || "Could not create the system record by given keys.",
                ex.code || "CREATE_SYSTEM_ERROR",
                {
                    keys,
                    system
                }
            );
        }
    };

    const getSystem = async (
        params: FormBuilderStorageOperationsGetSystemParams
    ): Promise<System | null> => {
        const keys = createKeys(params);

        try {
            const result = await entity.get(keys);
            if (!result || !result.Item) {
                return null;
            }
            return cleanupItem(entity, result.Item);
        } catch (ex) {
            throw new WebinyError(
                ex.message || "Could not get the system record by given keys.",
                ex.code || "LOAD_SYSTEM_ERROR",
                {
                    keys
                }
            );
        }
    };

    const updateSystem = async (
        params: FormBuilderStorageOperationsUpdateSystemParams
    ): Promise<System> => {
        const { system, original } = params;
        const keys = createKeys(system);

        try {
            await entity.put({
                ...system,
                ...keys
            });
            return system;
        } catch (ex) {
            throw new WebinyError(
                ex.message || "Could not update the system record by given keys.",
                ex.code || "UPDATE_SYSTEM_ERROR",
                {
                    keys,
                    original,
                    system
                }
            );
        }
    };

    return {
        createSystem,
        getSystem,
        updateSystem,
        createSystemPartitionKey,
        createSystemSortKey
    };
};
