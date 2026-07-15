export const GAME_CONFIG = {
    TIME_LIMIT: 120, // seconds
    PARENT_MAX_CAPACITY: 10,
    BASE_MAX_HP: 100,
    BASE_HP_DECREASE_RATE: 10, // per second when parent is near
    BASE_HP_INCREASE_RATE: 20, // per second when child with kit is near
    TOY_SMALL: {
        capacity: 1,
        score: 1,
        weight: 1
    },
    TOY_LARGE: {
        capacity: 5,
        score: 10,
        weight: 10
    },
    COLORS: {
        BG: 0xE8DFC8,
        PARENT: 0x3B82F6,
        CHILD: 0xF97316,
        TOY_SMALL: 0xFDE68A,
        TOY_LARGE: 0xF87171,
        BASE: 0xA78BFA,
        TRASH: 0x6B7280, // gray for trash can
        KIT: 0x10B981 // green for repair kit
    },
    PHYSICS: {
        BASE_SPEED: 200, // units per second (approx 1/4 screen width if screen is 800)
    }
};

export const calculateSpeed = (totalWeight: number): number => {
    return Math.max(0.2, 1 / (1 + totalWeight / 10)) * GAME_CONFIG.PHYSICS.BASE_SPEED;
};
