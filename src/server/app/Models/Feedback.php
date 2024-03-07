<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property numeric $id
 * @property string $variant
 * @property string $name
 * @property string $email
 * @property string $message
 */
class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
}
